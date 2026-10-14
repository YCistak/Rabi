"""Play'de bir izdeki (varsayılan alpha) sürümü başka ize yükseltir.

Yeniden yükleme yapmaz: aynı versionCode ikinci kez yüklenemez, bu yüzden
Play Developer API'nin edits uçlarıyla var olan sürümü hedef ize ekler.

Ortam değişkenleri: PLAY_SERVICE_ACCOUNT_JSON (servis hesabı JSON içeriği).
Kullanım: play_yukselt.py PAKET VERSIONCODE [--kaynak alpha] [--hedef production]
          [--notlar dosya] [--dil tr-TR]
"""
import argparse
import json
import os
import sys

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


def main():
    a = argparse.ArgumentParser()
    a.add_argument("paket")
    a.add_argument("versioncode", type=int)
    a.add_argument("--kaynak", default="alpha")
    a.add_argument("--hedef", default="production")
    a.add_argument("--notlar", default="android/surum-notlari/whatsnew-tr-TR")
    a.add_argument("--dil", default="tr-TR")
    g = a.parse_args()

    bilgi = json.loads(os.environ["PLAY_SERVICE_ACCOUNT_JSON"])
    kimlik = service_account.Credentials.from_service_account_info(
        bilgi, scopes=["https://www.googleapis.com/auth/androidpublisher"])
    servis = build("androidpublisher", "v3", credentials=kimlik, cache_discovery=False)
    edits = servis.edits()

    try:
        edit = edits.insert(packageName=g.paket, body={}).execute()
        eid = edit["id"]

        # Kaynak izde bu versionCode gerçekten var mı, onu doğrula.
        kaynak = edits.tracks().get(packageName=g.paket, editId=eid, track=g.kaynak).execute()
        bulundu = any(g.versioncode in (int(v) for v in r.get("versionCodes", []))
                      for r in kaynak.get("releases", []))
        print(f"{g.kaynak} izi sürümleri:",
              [(r.get("name"), r.get("status"), r.get("versionCodes")) for r in kaynak.get("releases", [])])
        if not bulundu:
            print(f"HATA: versionCode {g.versioncode}, {g.kaynak} izinde yok.", file=sys.stderr)
            sys.exit(1)

        with open(g.notlar, encoding="utf-8") as f:
            not_metni = f.read().strip()

        surum = {
            "versionCodes": [str(g.versioncode)],
            "status": "completed",
            "releaseNotes": [{"language": g.dil, "text": not_metni}],
        }
        for r in kaynak["releases"]:
            if g.versioncode in (int(v) for v in r.get("versionCodes", [])) and r.get("name"):
                surum["name"] = r["name"]

        edits.tracks().update(packageName=g.paket, editId=eid, track=g.hedef,
                              body={"track": g.hedef, "releases": [surum]}).execute()
        sonuc = edits.commit(packageName=g.paket, editId=eid).execute()
        print("Yükseltme tamam:", json.dumps(sonuc))
    except HttpError as e:
        print("Google API hatası (aynen):", file=sys.stderr)
        print(e.content.decode("utf-8", "replace"), file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
