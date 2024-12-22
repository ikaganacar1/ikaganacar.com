from reportlab.lib.pagesizes import A5, landscape
from reportlab.pdfgen import canvas
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics


def create_aidat_makbuzu(
    daire_no,
    ay_yil,
    tarih,
    makbuz_no,
    tutar,
    yazi_ile,
    alan_ad,
    veren_ad,
    masraflar_list,
):

    c = canvas.Canvas(f"receipts/receipt_{daire_no}_{makbuz_no}.pdf", pagesize=landscape(A5))
    width, height = landscape(A5)
    
    pdfmetrics.registerFont(TTFont("Vera", "Vera.ttf"))
    pdfmetrics.registerFont(TTFont("VeraBd", "VeraBd.ttf"))
    c.setFont("Vera", 10)

    c.setFont("VeraBd", 20)
    c.drawString(125, height - 40, "APARTMAN GELİR-GİDER MAKBUZU")

    c.setFont("Vera", 10)
    c.drawString(30, height - 70, f"Daire No: {daire_no}")
    c.drawString(200, height - 70, f"Ait Olduğu Ay/Yıl: {ay_yil}")
    c.drawString(30, height - 90, f"Tarih: {tarih}")
    c.drawString(200, height - 90, f"Makbuz No: {makbuz_no}")

    c.setFont("VeraBd", 12)
    c.drawString(25, height - 120, "Masraflar:")
    c.drawString(130, height - 120, "Tutarlar:")
    c.setFont("Vera", 10)

    y_position = height - 150
    try:
        toplam = 0
        for masraf, miktar in masraflar_list:
            c.rect(25, y_position, 100, 20)
            c.rect(130, y_position, 100, 20)

            c.drawString(40, y_position + 5, masraf)
            c.drawString(140, y_position + 5, miktar)
            y_position -= 20

            toplam += int(miktar)
    except Exception as e:
        print(e)
        toplam = 0

    c.rect(25, y_position, 100, 20)
    c.rect(130, y_position, 100, 20)
    c.drawString(40, y_position + 5, "TOPLAM")
    c.drawString(140, y_position + 5, f"{toplam} TL")

    y_position = height - 140
    x_position = 225

    c.setFont("VeraBd", 14)
    c.drawString(x_position + 130, y_position, f"Alınan Aidat:")

    y_position -= 30
    c.rect(x_position + 135, y_position, 100, 25)
    c.drawString(x_position + 145, y_position + 5, f"-{tutar}- TL")

    y_position -= 25
    c.drawString(x_position + 30, y_position, f"Yazı ile: {yazi_ile} Türk Lirası")

    y_position -= 20
    c.drawString(x_position + 30, y_position, f"Sayın {alan_ad} 'den alınmıştır.")

    y_position -= 60
    c.drawString(x_position + 40, y_position + 20, "MAKBUZU VEREN")
    c.drawString(x_position + 255, y_position + 20, "İMZA")

    y_position -= 20
    c.drawString(x_position + 40, y_position + 10, f"{veren_ad}")
    c.rect(x_position + 25, y_position - 5, 150, 40)  # Adı Soyadı kutusu
    c.rect(x_position + 195, y_position - 5, 150, 40)  # İmza kutusu

    c.setFont("VeraBd", 6)
    c.drawString(5, y_position - 120, f"ikaganacar.com")
    c.save()
    print(f"Makbuz başarıyla oluşturuldu.")
