import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
import {
  createUserWithEmailAndPasswordInput,
  generateUserTokenPayload,
  GenerateUserTokenPayloadType,
  signInWithEmailAndPasswordInput,
  SignInWithEmailAndPasswordInputType,
  type CreateUserWithEmailAndPasswordInputType,
} from "./model";
import { env } from "../env";
import { userInfo } from "node:os";
class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!result || result.length === 0) return null;
    return result[0];
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = JWT.sign({ id }, env.JWT_SECRET_KEY);
    return { token };
  }

  private async verifyUserToken(token: string): Promise<GenerateUserTokenPayloadType> {
    try {
      const verificationResult = JWT.verify(
        token,
        env.JWT_SECRET_KEY,
      ) as GenerateUserTokenPayloadType;
      return verificationResult;
    } catch (err) {
      throw new Error("Invalid token");
    }
  }

  private async getUserInfoById(id: string) {
    const result = await db
      .select({
        id: usersTable.id,
        fullName: usersTable.fullName,
        email: usersTable.email,
        profileImageUrl: usersTable.profileImageUrl,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);
    if (!result || result.length === 0) throw new Error(`User with id ${id} does not exist`);
    return result[0]!;
  }

  private async generateHash(password: string, salt: string) {
    return createHmac("sha256", salt).update(password).digest("hex");
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    //check if user with the email already exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) throw new Error("User with this email already exists");

    //create salt and hash the password using the salt
    const salt = randomBytes(16).toString("hex");
    const hash = await this.generateHash(password, salt);

    //create user in DB
    const userInsertResult = await db
      .insert(usersTable)
      .values({
        fullName,
        email,
        password: hash,
        salt,
      })
      .returning({
        id: usersTable.id,
      });

    if (!userInsertResult || userInsertResult.length === 0 || !userInsertResult[0]?.id)
      throw new Error("Something went wrong while creating the user");

    const userId = userInsertResult[0].id;

    //generate JWT token for the user
    const { token } = await this.generateUserToken({ id: userId });

    return {
      id: userId,
      token,
    };
  }

  public async signInWithEmailAndPassword(payload: SignInWithEmailAndPasswordInputType) {
    const { email, password } = await signInWithEmailAndPasswordInput.parseAsync(payload);

    const existingUser = await this.getUserByEmail(email);
    if (!existingUser) throw new Error(`User with email ${email} does not exist`);

    if (!existingUser.password || !existingUser.salt)
      throw new Error("Invalid authentication method");

    const salt = existingUser.salt;
    const hash = await this.generateHash(password, salt);

    if (hash !== existingUser.password) throw new Error("Invalid email or password");

    const { token } = await this.generateUserToken({ id: existingUser.id });

    return {
      id: existingUser.id,
      token,
    };
  }

  public async verifyAndDecodeUserToken(token: string) {
    const { id } = await this.verifyUserToken(token);
    const userInfo = await this.getUserInfoById(id);
    return { ...userInfo };
  }
}

export default UserService;
