import "express";

declare module "express" {
  export interface Request {
    address?: string;
  }
}
