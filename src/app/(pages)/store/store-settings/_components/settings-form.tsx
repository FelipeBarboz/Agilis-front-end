"use client";

import { UploadCloud, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsForm() {
  return (
    <form className="flex flex-col divide-y divide-border w-full" onSubmit={(e) => e.preventDefault()}>
      
      {/* Public profile */}
      <div className="flex flex-col sm:flex-row gap-6 py-6 first:pt-0">
        <div className="sm:w-1/3">
          <h3 className="text-sm font-bold text-foreground">Public profile</h3>
          <p className="text-sm text-muted-foreground mt-1">This will be displayed on your profile.</p>
        </div>
        <div className="sm:w-2/3 flex flex-col gap-4 max-w-2xl">
          <input
            type="text"
            placeholder="Sisyphus Ventures"
            defaultValue="Sisyphus Ventures"
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex rounded-lg shadow-sm">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-4 text-sm text-muted-foreground">
              untitledui.com/
            </span>
            <input
              type="text"
              defaultValue="sisyphus"
              className="w-full rounded-r-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Company logo */}
      <div className="flex flex-col sm:flex-row gap-6 py-6">
        <div className="sm:w-1/3">
          <h3 className="text-sm font-bold text-foreground">Company logo</h3>
          <p className="text-sm text-muted-foreground mt-1">Update your company logo and then choose where you want it to display.</p>
        </div>
        <div className="sm:w-2/3 flex flex-col sm:flex-row items-center sm:items-start gap-6 max-w-2xl">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#006b49] text-white">
            {/* mock logo text or icon */}
            <span className="text-2xl font-light">S</span>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-black">
              <Check className="size-3 text-white" strokeWidth={3} />
            </div>
          </div>
          
          <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-6 px-4 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100">
              <UploadCloud className="size-5 text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-primary">
              <span className="text-black">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="flex flex-col sm:flex-row gap-6 py-6">
        <div className="sm:w-1/3">
          <h3 className="text-sm font-bold text-foreground">Branding</h3>
          <p className="text-sm text-muted-foreground mt-1">Add your logo to reports and emails.</p>
          <a href="#" className="mt-2 text-sm font-bold text-black hover:underline inline-block">View examples</a>
        </div>
        <div className="sm:w-2/3 flex flex-col gap-4 max-w-2xl">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded border border-input bg-black text-white group-hover:bg-gray-800 transition-colors">
              <Check className="size-3" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Reports</span>
              <span className="text-sm text-muted-foreground">Include my logo in summary reports.</span>
            </div>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="mt-0.5 flex h-4 w-4 items-center justify-center rounded border border-input bg-black text-white group-hover:bg-gray-800 transition-colors">
              <Check className="size-3" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Emails</span>
              <span className="text-sm text-muted-foreground">Include my logo in customer emails.</span>
            </div>
          </label>
        </div>
      </div>

      {/* Social profiles */}
      <div className="flex flex-col sm:flex-row gap-6 py-6">
        <div className="sm:w-1/3">
          <h3 className="text-sm font-bold text-foreground">Social profiles</h3>
          <p className="text-sm text-muted-foreground mt-1">Add your social profiles.</p>
        </div>
        <div className="sm:w-2/3 flex flex-col gap-4 max-w-2xl">
          <div className="flex rounded-lg shadow-sm">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-4 text-sm text-muted-foreground">
              twitter.com/
            </span>
            <input
              type="text"
              defaultValue="sisyphusvc"
              className="w-full rounded-r-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex rounded-lg shadow-sm">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-4 text-sm text-muted-foreground">
              facebook.com/
            </span>
            <input
              type="text"
              defaultValue="sisyphusvc"
              className="w-full rounded-r-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex rounded-lg shadow-sm">
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-4 text-sm text-muted-foreground">
              linkedin.com/company/
            </span>
            <input
              type="text"
              defaultValue="sisyphusvc"
              className="w-full rounded-r-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
      
      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 last:pb-0">
        <Button variant="outline" className="px-4 py-2 h-auto text-sm font-bold text-black border-gray-300">
          Cancel
        </Button>
        <Button className="px-4 py-2 h-auto text-sm font-bold bg-black text-white hover:bg-gray-800">
          Save changes
        </Button>
      </div>

    </form>
  );
}
