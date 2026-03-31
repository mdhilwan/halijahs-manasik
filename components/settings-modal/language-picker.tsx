import React from 'react'
import {Picker} from "@react-native-picker/picker";
import {useLanguage} from "@/contexts/LanguageContext";

export const LanguagePicker = () => {
  const {language, setLanguage} = useLanguage();

  return <>
    <Picker
      selectedValue={language}
      onValueChange={(value) => setLanguage(value)}
      style={{width: "100%"}}
    >
      <Picker.Item label="English" value="en"/>
      <Picker.Item label="Malay" value="my"/>
    </Picker>
  </>
}