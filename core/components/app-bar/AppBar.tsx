import Images from "@/core/assets/Images";
import Image from "next/image";
import MainNav from "./MainNav";
import NativeSelect from "../native-select/NativeSelect";
import { useLanding } from "@/modules/home/presentation/store/useLanding";

export default function AppBar() {
  const lang = useLanding((state) => state.lang);
  const selectLang = useLanding((state) => state.selectLang);

  const handleSetLang = (value: string) => {
    selectLang(value);
  };

  return (
    <main className="flex fixed top-0 left-0 z-50 gap-4 items-center justify-between w-full h-[60px] py-4 px-8 bg-[black]">
      <section className="flex gap-10 items-center">
        <div className="bg-black">
          <Image
            src={Images.logoFullWhiteTextOpacity}
            alt="Sit"
            width={96}
            height={96}
          />
        </div>

        <section className="w-fit">
          <MainNav />
        </section>
      </section>

      <section>
        <NativeSelect
          value={lang}
          onChange={(e) => handleSetLang(e)}
          options={[
            { value: "es", label: "es" },
            { value: "en", label: "en" },
          ]}
        />
      </section>
    </main>
  );
}
