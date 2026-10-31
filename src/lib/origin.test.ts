import { describe, expect, it } from "vitest";
import { AppError } from "@/lib/errors";
import { assertTrustedOrigin } from "@/lib/origin";

describe("assertTrustedOrigin", () => {
  it("accepts the configured application origin", () => {
    const headers = new Headers({ origin: "https://gatherly.example", host: "gatherly.example" });
    expect(() => assertTrustedOrigin(headers, "https://gatherly.example")).not.toThrow();
  });

  it("rejects missing and cross-site origins", () => {
    expect(() => assertTrustedOrigin(new Headers(), "https://gatherly.example")).toThrow(AppError);
    expect(() =>
      assertTrustedOrigin(
        new Headers({ origin: "https://attacker.example", host: "gatherly.example" }),
        "https://gatherly.example",
      ),
    ).toThrow(AppError);
  });
});
