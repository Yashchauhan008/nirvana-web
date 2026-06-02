import { TransitionProvider } from "@/contexts/TransitionContext";
import { NirvanaHeader } from "@/components/shared/nirvana-header";
import { zaslia } from "@/lib/fonts/zaslia";
import "@/styles/home.css";

export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`nirvana-home grain ${zaslia.variable} min-h-screen relative`}>
      <TransitionProvider>
        <NirvanaHeader />
        {children}
      </TransitionProvider>
    </div>
  );
}
