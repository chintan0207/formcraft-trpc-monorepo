import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/models/user";
import { createHmac, randomBytes } from "node:crypto";
import JWT from "jsonwebtoken";
import {
  createUserWithEmailAndPasswordInput,
  generateUserTokenPayload,
  GenerateUserTokenPayloadType,
  type CreateUserWithEmailAndPasswordInputType,
} from "./model";
import { env } from "../env";
class UserService {
  private async getUserByEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!result || result.length === 0) return null;
    return result;
  }

  private async generateUserToken(payload: GenerateUserTokenPayloadType) {
    const { id } = await generateUserTokenPayload.parseAsync(payload);
    const token = JWT.sign({ id }, env.JWT_SECRET_KEY);
    return { token };
  }

  public async createUserWithEmailAndPassword(payload: CreateUserWithEmailAndPasswordInputType) {
    const { fullName, email, password } =
      await createUserWithEmailAndPasswordInput.parseAsync(payload);

    //check if user with the email already exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) throw new Error("User with this email already exists");

    //create salt and hash the password using the salt
    const salt = randomBytes(16).toString("hex");
    const hash = createHmac("sha256", salt).update(password).digest("hex");

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
}

export default UserService;
