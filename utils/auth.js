import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(password, hashedPassword) {
  const isValid = await compare(password, hashedPassword);
  return isValid;
}

export function generateToken(data) {
  const token = sign({ ...data }, process.env.SECRET_KEY, {
    // algorithm: "",
    expiresIn: "24h",
  });

  return token;
}
