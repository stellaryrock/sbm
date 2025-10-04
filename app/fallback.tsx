import { DummyProfile } from "@/lib/utils";
import Image from "next/image";

export default function FallbackImage() {
  return <Image src={DummyProfile} alt="guest" width={30} height={30} />;
}
