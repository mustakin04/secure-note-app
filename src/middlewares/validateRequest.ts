
import { type RequestHandler } from "express";
import { z } from "zod";

const validateRequest = <
  T extends z.ZodType<{ body: unknown }>
>(
  schema: T
): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });

      return;
    }

    req.body = result.data.body;

    next();
  };
};

export default validateRequest;
