import { z } from "zod";

export const createUserWithEmailAndPasswordInputModel = z.object({
  fullName: z.string().describe("full name of the user"),
  email: z.string().email().describe("email address of the user"),
  password: z.string().describe("password of the user"),
});

export const createUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("id of the created user"),
});

export const signInWithEmailAndPasswordInputModel = z.object({
  email: z.string().email().describe("email address of the user"),
  password: z.string().describe("password of the user"),
});

export const signInWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("id of the user"),
});

export const getLoggedInUserInfoInputModel = z.undefined();

export const getLoggedInUserInfoOutputModel = z.object({
  id: z.string().describe("id of the user"),
  fullName: z.string().describe("full name of the user"),
  email: z.string().email().describe("email address of the user"),
  profileImageUrl: z.string().describe("profile Image url of the user").optional().nullable(),
  });
