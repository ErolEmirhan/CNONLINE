"use client";

import type { ReactNode } from "react";
import { StoreSettingsProvider } from "@/context/store-settings-context";
import { CampaignsProvider } from "@/context/campaigns-context";
import { CartProvider } from "@/store/cart-store";
import { BroadcastMessagePopup } from "@/components/BroadcastMessagePopup";
import { CampaignPopup } from "@/components/CampaignPopup";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StoreSettingsProvider>
      <CampaignsProvider>
        <CartProvider>
          {children}
          <BroadcastMessagePopup />
          <CampaignPopup />
        </CartProvider>
      </CampaignsProvider>
    </StoreSettingsProvider>
  );
}
