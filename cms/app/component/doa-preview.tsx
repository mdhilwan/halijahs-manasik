// Example in home page or edit page
import IphoneFrame from "./iphone-frame";
import { useState } from "react";
import {DuaEngMalayArabicType, DuaType} from "../../../app/types";
import {Scheherazade_New} from "next/font/google";

const scheherazadeNew = Scheherazade_New({
  weight: "400",
  subsets: ["arabic"]
})

const DoaPreview = (props: DuaType) => {
  const [language, setLanguage] = useState<"en" | "ms">("en");

  const {titleEn, doa} = props

  return (
    <div>
      <div className="flex justify-center mb-3 gap-2">
        <button
          className={`px-3 py-1 text-xs rounded-lg border ${
            language === "en" ? "bg-black text-white" : "bg-white"
          }`}
          onClick={() => setLanguage("en")}
        >
          EN
        </button>
        <button
          className={`px-3 py-1 text-xs rounded-lg border ${
            language === "ms" ? "bg-black text-white" : "bg-white"
          }`}
          onClick={() => setLanguage("ms")}
        >
          MY
        </button>
      </div>

      <IphoneFrame>
        <div className="text-center relative max-h-full">
          <h2 className="text-xl font-bold">{titleEn}</h2>
          <div className={"overflow-y-scroll max-h-[700px]"}>
            {doa && <>
              {doa.map((d: DuaEngMalayArabicType) => <div key={d.id}>
                <p className={scheherazadeNew.className + " text-3xl leading-relaxed my-2"}>
                  {d.arabic}
                </p>
                <p className="my-2">
                  {language === "en" ? d.translationEn : d.translationMy}
                </p>
              </div>)}
            </>}
          </div>
        </div>
      </IphoneFrame>
    </div>
  );
};

export default DoaPreview;