import { Button } from "@/components/ui/button";

export function NaverLoginButton() {
  return (
    <Button
      variant="outline"
      className="h-12 w-full gap-2 bg-[#03C75A] text-white hover:bg-[#02b155]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="white"
        aria-hidden="true"
      >
        <path d="M4 4h5.37l5.26 8.28V4H20v16h-5.37l-5.26-8.28V20H4z" />
      </svg>
      <span className="font-medium text-sm">Naver</span>
    </Button>
  );
}
