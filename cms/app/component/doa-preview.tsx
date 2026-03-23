import IphoneFrame from "./iphone-frame";
import { useState } from "react";
import { Scheherazade_New } from "next/font/google";
import {DuaEngMalayArabicType, DuaType} from "../../../config/types";

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
        <div className="text-center relative h-full px-3 bg-gradient-to-b from-emerald-50 to-white">
          {/* App header */}
          <div className="py-3 border-b border-emerald-100">
            <h2 className="text-base font-bold text-zinc-900">
              {language === "en" ? titleEn : titleMy}
            </h2>
            {language === "en" && titleMy && (
              <p className="text-[10px] text-zinc-500 mt-0.5">{titleMy}</p>
            )}
            {language === "ms" && titleEn && (
              <p className="text-[10px] text-zinc-500 mt-0.5">{titleEn}</p>
            )}
          </div>
          
          <div className="overflow-y-auto max-h-[430px] py-3">
            {doa && doa.length > 0 ? (
              doa.map((d: DuaEngMalayArabicType, index: number) => (
                <div key={d.id} className={index > 0 ? "mt-4 pt-4 border-t border-emerald-100" : ""}>
                  {d.arabic && (
                    <p 
                      className={`${scheherazadeNew.className} text-xl leading-loose mb-2 text-zinc-900`}
                      dir="rtl"
                    >
                      {d.arabic}
                    </p>
                  )}
                  <p className="text-xs text-zinc-600 leading-relaxed text-left">
                    {language === "en" ? d.translationEn : d.translationMy}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-zinc-400 text-xs py-8">
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
