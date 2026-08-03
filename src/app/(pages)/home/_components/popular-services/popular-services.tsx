import { PopularServicesDesktop } from "./popular-services-desktop";
import { PopularServicesMobile } from "./popular-services-mobile";

export function PopularServices() {
    return (
        <>
            <div className="hidden lg:block">
                <PopularServicesDesktop />
            </div>

            <div className="lg:hidden">
                <PopularServicesMobile />
            </div>
        </>
    );
}
