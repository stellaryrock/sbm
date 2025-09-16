import { use } from "react";

type Props = {
  searchParams: Promise<{ error: string }>;
};

const getMessage = (error: string) => {
  if (error === "CheckEmail") return "Check Your Email, Plz!";
  if (error === "InvalidEmailCheck") return "Invalid Email Authorization Key!";
};

export default function AuthError({ searchParams }: Props) {
  const { error } = use(searchParams);

  return (
    <div className="grid h-full place-items-center">
      <div>
        <h1 className="text-3xl">Sign Error Occured</h1>
        <div>{getMessage(error)}</div>
      </div>
    </div>
  );
}
