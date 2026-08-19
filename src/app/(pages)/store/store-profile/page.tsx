"use client";

import { HeaderProfile } from "./_components/header-profile";
import { AppointmentsList } from "./_components/appointments-list";
import { ServicesList } from "./_components/services-list";

export default function StoreProfilePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-muted/30 pb-20">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-4xl space-y-8">
        
        {/* Profile Header */}
        <HeaderProfile />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area (Tabs/Sections) */}
          <div className="lg:col-span-12 flex flex-col gap-8">
            
            <div className="rounded-3xl border bg-white p-5 sm:p-8 shadow-sm">
              <AppointmentsList />
            </div>

            <div className="rounded-3xl border bg-white p-5 sm:p-8 shadow-sm">
              <ServicesList />
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

