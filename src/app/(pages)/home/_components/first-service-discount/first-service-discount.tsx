import { FirstServiceDiscountDesktop } from "./first-service-discount-desktop";
import { FirstServiceDiscountMobile } from "./first-service-discount-mobile";

export function FirstServiceDiscount() {
  return (
    <>
      <div className="hidden lg:block">
        <FirstServiceDiscountDesktop />
      </div>

      <div className="lg:hidden">
        <FirstServiceDiscountMobile />
      </div>
    </>
  );
}
