import sys
import requests
from bs4 import BeautifulSoup

URL = "https://chromewebstore.google.com/detail/hackerfeed/ipgmacbmlloikoomjkmoknkbalcgmoni"

CSS_SELECTOR = (
    "html body#yDmH0d c-wiz.SSPGKf div.T4LgNb div.kFwPee main.LDZgRb.qxll "
    "div.P2YWP.qxll section.MHH2Z div.im4wIf ul.TKAMQe li.MqICNe.ecmXy div.nBZElf"
)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
}

def fetch(url: str) -> str:
    r = requests.get(url, headers=HEADERS, timeout=20)
    r.raise_for_status()
    return r.text

def main():
    html_content = fetch(URL)
    soup = BeautifulSoup(html_content, "html.parser")
    elements = soup.select(CSS_SELECTOR)

    if not elements:
        print("ERROR", file=sys.stderr)
        sys.exit(1)

    text = elements[0].get_text(strip=True)
    print(text)
    return text

if __name__ == "__main__":
    main()