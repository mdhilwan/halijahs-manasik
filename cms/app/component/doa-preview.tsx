import IphoneFrame from "./iphone-frame";
import { useState } from "react";
import { DuaEngMalayArabicType, DuaType } from "../../../app/types";
import { Scheherazade_New } from "next/font/google";

const scheherazadeNew = Scheherazade_New({
  weight: "400",
  subsets: ["arabic"]
})

const DoaPreview = (props: DuaType) => {
  const [language, setLanguage] = useState<"en" | "ms">("en");

  const { titleEn, titleMy, doa } = props

  return (
    <div>
      <div className="flex justify-center mb-3 gap-2">
        <button
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            language === "en" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setLanguage("en")}
        >
          English
        </button>
        <button
          className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            language === "ms" 
              ? "bg-primary text-primary-foreground" 
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
          onClick={() => setLanguage("ms")}
        >
          Malay
        </button>
      </div>

      <IphoneFrame>
        <div className="text-center relative max-h-full">
          <h2 className="text-lg font-bold text-foreground mb-1">
            {language === "en" ? titleEn : titleMy}
          </h2>
          {language === "en" && titleMy && (
            <p className="text-xs text-muted-foreground mb-3">{titleMy}</p>
          )}
          {language === "ms" && titleEn && (
            <p className="text-xs text-muted-foreground mb-3">{titleEn}</p>
          )}
          
          <div className="overflow-y-auto max-h-[580px] px-2">
            {doa && doa.length > 0 ? (
              doa.map((d: DuaEngMalayArabicType, index: number) => (
                <div key={d.id} className={index > 0 ? "mt-6 pt-6 border-t border-border" : ""}>
                  {d.arabic && (
                    <p 
                      className={`${scheherazadeNew.className} text-2xl leading-loose mb-3 text-foreground`}
                      dir="rtl"
                    >
                      {d.arabic}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === "en" ? d.translationEn : d.translationMy}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-sm py-8">
                No doa entries yet
              </div>
            )}
          </div>
        </div>
      </IphoneFrame>
    </div>
  );
};

export default DoaPreview;
