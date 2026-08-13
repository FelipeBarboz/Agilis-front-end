"use client";

import { SettingsForm } from "./_components/settings-form";
import { Button } from "@/components/ui/button";

export default function StoreSettingsPage() {
  return (
    <div className="flex min-h-full flex-col bg-muted/30 pb-20">
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-6 bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-border">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Company profile</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Update your company photo and details here.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="px-4 py-2 h-auto text-sm font-bold text-black border-gray-300">
                Cancel
              </Button>
              <Button className="px-4 py-2 h-auto text-sm font-bold bg-black text-white hover:bg-gray-800">
                Save changes
              </Button>
            </div>
          </div>
          
          <div className="w-full h-px bg-border mt-2 mb-4" />

          {/* Form */}
          <SettingsForm />

        </div>
      </main>
    </div>
  );
}
