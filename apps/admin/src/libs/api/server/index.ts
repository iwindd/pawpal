import PawApi from "../api";
import AuthApi from "../services/Auth";

export class ServerApi extends PawApi {
  public readonly auth: AuthApi;

  constructor(token?: string) {
    super(token);
    this.auth = new AuthApi(this.client);
  }
}

export async function APISession() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return new ServerApi(token);
}
