// Example in home page or edit page
import IphoneFrame from "./iphone-frame";
import {DuaEngMalayArabicType, DuaType} from "../../../app/types";
import {Scheherazade_New} from "next/font/google";

const scheherazadeNew = Scheherazade_New({
  weight: "400",
  subsets: ["arabic"]
})

const DoaPreview = (props: DuaType) => {

  const {titleEn, doa} = props

  console.log(props)
  return (
    <IphoneFrame>
      <div className="text-center">
        <h2 className="text-xl font-bold">{titleEn}</h2>
        {doa && <>
          {doa.map((d: DuaEngMalayArabicType) => <>
            <p className={scheherazadeNew.className + " text-3xl leading-relaxed"}>
              {d.arabic}
            </p>
          </>)}
        </>}
      </div>
    </IphoneFrame>
  );
};

export default DoaPreview;