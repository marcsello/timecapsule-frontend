<template>
  <b-modal id="privacy-policy-popup" scrollable hide-footer title="Adatkezelési tájékoztató" size="lg">
    <ol class="paragraphs">
      <li>
        Nagyatád Város Önkormányzata megbízásából a Nagyatád Kulturális és Sport Központ végzi az időkapszulába
        elhelyezett adatok gyűjtését, rendszerezését és archiválását. A feltöltött adatok között személyes adatok is
        szerepelnek, melyeknek kezelése előzetes hozzájárulást igényel.
      </li>
      <li>
        Adatokat csak az tölthet fel, aki hozzájárul a személyes adatainak kezeléséhez. A név és lakcím megadása
        kötelező, ezek valóságtartalmát az adatkezelő esetenként ellenőrizheti.
      </li>
      <li>
        Az e-mail cím és a telefonszám megadása opcionális. Az e-mail címet a Nagyatádi Kulturális Központ a
        későbbiekben felhasználhatja az évfordulós rendezvényekről való tájékoztatásra, az időkapszula elhelyezéséről
        való értesítésre.
      </li>
      <li>
        Az adatkezelő a személyes adatokat harmadik fél részére nem adja át.
      </li>
      <li>
        Az összesített adatok digitális módon kerülnek tárolásra két adathordozón, melyek egyike az időkapszulába, a
        másik a városi múzeumba kerül . A feltöltött információk a központi szerverről a biztonságos archiválást
        követően törlésre kerülnek.
      </li>
      <li>
        Az adatkezelő ellenőrizheti a feltöltött anyagok tartalmát és a személyiségi jogokat, kisebbségi jogokat és a
        közízlést sértő anyagokat törli. Valamint minden olyan információt töröl, melyek tárolása jogszabálysértő.
      </li>
      <li>
        Az adathordozón tároltak 50 év múlva kerülnek teljes egészében nyilvánosságra. A városi múzeumban elhelyezett
        biztonsági másolat múzeumi anyagként 10 év múlva kutatható, de kizárólag engedéllyel és a teljes tartalma
        semmiképp sem publikálható.
      </li>
      <li>
        Az anyagok tárolására és kezelésére során a Nagyatádi Kulturális és Sport Központ figyelembe veszi az Európai
        Unió és Magyarország hatályos jogszabályait és mindent megtesz az itt kezelt személyes anyagok biztonsága
        érdekében.
      </li>
      <li>
        Az adatokat feltöltők vállalják, hogy csak olyan anyagokat töltenek fel, melyek szerzői jogokat nem sértenek, a
        saját tulajdonukat képezik, a saját szellemi termékük.
      </li>
    </ol>
  </b-modal>
</template>

<script>
export default {
  name: "PrivacyPolicyPopup",
}
</script>

<style scoped>
 ol.paragraphs > li {
   margin-bottom: 1em;
 }
</style>