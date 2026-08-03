import { HeroSectionDesktop } from "./hero-section-desktop";
import { HeroSectionMobile } from "./hero-section-mobile";

export function HeroSection() {
    return (
        <>
            <div className="hidden lg:block">
                <HeroSectionDesktop />
            </div>

            <div className="lg:hidden">
                <HeroSectionMobile />
            </div>
        </>
    );
}
