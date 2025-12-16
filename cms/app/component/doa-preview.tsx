// Example in home page or edit page
import IphoneFrame from "./iphone-frame";

type DoaPreviewType = {
  titleEn: string;
  titleMy: string;
}

const DoaPreview = (props: DoaPreviewType) => {

  const {titleEn} = props

  return (
    <IphoneFrame>
      <div className="text-center">
        <h2 className="text-xl font-bold">{titleEn}</h2>
        <p className="mt-2 text-gray-700">
          In the name of Allah, the Most Gracious, the Most Merciful...
        </p>
      </div>
    </IphoneFrame>
  );
};

export default DoaPreview;