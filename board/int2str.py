#https://github.com/ibrahimirdem/convert-numbers-to-text/blob/master/cevirici.py
#Kodu buradan aldım çok teşekkürler

import math

def int2str(num):
    
    #Yazimizda anlattigimiz uc haneli okuma islemlerini
    #bu fonksiyon altında yapacagiz.

    # Uc haneli sayilarimizi okumasi icin ucHaneOku adinda bir fonk.
    #olusturduk.
    def ucHaneOku(sayi): #uc haneli sayimizi disarında sayi diye aldik
        # Sayi tanimlamalari yaptik. Bunlari sozluk olarak kayit ettik.
        birler = {"0":"","1":"Bir","2":"Iki","3":"Uc","4":"Dort","5":"Bes","6":"Alti","7":"Yedi","8":"Sekiz","9":"Dokuz"}
        onlar = {"1":"On","2":"Yirmi","3":"Otuz","4":"Kirk","5":"Elli","6":"Altmis","7":"Yetmis","8":"Seksen","9":"Doksan","0":""}
        yuz = ["Yuz"]
        #Sayimiz 3 haneli ise once basina yuz yaz sonra sonra girlen sayiya esdeger onlar
        #basamagini daha sonra da ayni sekilde birler basamagini
        if len(sayi) == 3:
            # Uc haneli sayi basi bir ise mesela 123 biryuzyirmiuc  olursa hatali olur
            # bunun icin basindaki sayi "1" ise sadece yuz ile baslayıp yuzyirmiuc diyecek. 
            if sayi[0] == "1":
                oku = yuz[0]+onlar[sayi[1]]+birler[sayi[2]]
                return oku
            #Basinda 0 var ise yani 2 haneli ise sadace onlar ve birleri yazdir
            if sayi[0] == "0":
                oku = onlar[sayi[1]]+birler[sayi[2]]
                return oku
            # Yukaridaki istisnalar yok ise once birler sayi eslestirip sonra yuz
            # diyecek daha sonrada onlar ve birler oku degiskenine aktarilacak.
            else:
                oku = birler[sayi[0]]+yuz[0]+onlar[sayi[1]]+birler[sayi[2]]
                return oku
        #Sayimiz bir haneli ise
        if  len(sayi) == 1:
            # Yukarida birlerde "0" a bos deger atadik. Cunku 120 degerine 
            #yuzyirmisifir degilde direkt sifir diyoruz bu yuzden tek hanede
            # sifir yazdik mi bos deger cikiyordu bunun  cozumunu yaptik.
            if sayi[0] == "0":
                oku = "Sifir"
                return oku
            # Sifir haric digerleri doğru bir sekilde yazili
            else:
                oku = birler[sayi[0]]
                return oku
        # Son olarak sayimiz 2 haneli ise nasıl okuyacagini ogrettik.
        if len(sayi) == 2:
            oku = onlar[sayi[0]]+birler[sayi[1]]
            return oku


    # raw_input() fonksiyonu ile sayimizi sayi kullanicidan alip sayi
    #degiskenine atiyoruz.
    sayi  = num
    # Sayilarimizi 3 erli bloklara boldugumuzde 2 haneli ve bir haneli
    #sayilar cikiyor. Mesela 1.234 bunu 1 ve 234 seklinde ayiriyor
    #biz ise bunu istemedigini icin mod alarak basina ne kadar sifir ekle-
    #yecigimizi buluyoruz.
    basaSifirEkle = len(sayi)%3
    # 1.234 deki 1'i 001 sekline getiriyor. ve 001 ve 234 seklinde olusuyor.
    if basaSifirEkle == 1:
        sayi = "00"+sayi
        
    elif basaSifirEkle == 2:
        sayi = "0"+sayi
    else:
        sayi = sayi

    # Kac tane uclu grup oldugunu buluyoruz bu milyon mu milyar mi gibi durum-
    #larda bize lazim bunuda len(sayi) ile kac basamak olddugunu bulup 3'e bolu-
    #yoruz. Mesela 4 haneli bir sayi 1.234 ise sonuc 4/3 den 1.33 olacak ceil
    #fonksiyonu ise sayi da kusurat varsa bir ust sayiya yuvarliyor. Yani 1.234
    #sayimizda "001" ve "234" den olusan 2 adet grup oldugunu soyluyor.
    kacYuzlerVar =  math.ceil(int(len(sayi))/3.0)
    #Uclu grub ların sonucu  gelecek degerler. Mesela 1.000.000 BirMilyon
    ucluGrub = {"0":"","1":"Bin","2":"Milyon","3":"Milyar","4":"Trilyon","5":"Katrilyon"}

    oku = ""
    # Uclu grup sayimizin kac tane oldugunu buluyoruz. Ve o grup sayisi kadar
    #dongu kuruyoruz
    for i in range(int(kacYuzlerVar)):
        # Burada 3 grup uclu varsa yani 123.456.345 gibi sayiyi tersten almaya
        #basliyor  i=o ile -1*((0*3)+1 = -1 ile en son ogeyi ondan onceki 
        #ve yine odan onceki yani son -1,-2 ve -3 uncu elemanlari alan bir formul
        #i=1 oldugunda yani 2. gruba binlere geciliyor o da -1*((1*3)+1=-4
        #yani -4,-5,-6 ile sonra uclu binleri okuyup sonuna bin yazmak
        
        #Uc haneli grubumuzun hepsi sifir ise hicbir degisiklik yapma
        #mesela 1.000 da "001" i bin diye okuyacak ve "000" hic bir sey deme
        #yecek ve sonuc sadece bin olacak
        if sayi[-1*((i*3)+3)]+sayi[-1*((i*3)+2)]+sayi[-1*((i*3)+1)] == "000":
            oku = oku
        # Burada da bir istisna durum engelleniyor kodumuz 1.000 i okurken BirBin
        #seklinde yanlis okuyor o yuzden sayi 6 haneli ve binler grubu "001" ise
        #bin kelimesini basina birsey yazma  
        elif sayi[-1*((i*3)+3)]+sayi[-1*((i*3)+2)]+sayi[-1*((i*3)+1)] == "001" and len(sayi) == 6:
            oku = ucluGrub[str(i)] + oku
        # İstisna durumlar yoksa belirttigimiz algoritmik sekilde bunu dondurerek yazdir. ve yazinin sonuna ekle
        # Mesela 535.776 sayisini once YediYuzYetmisAlti okuyup oku degiskenine atadi ve sona ekledi. Sonra
        #BesYuzOtuzBesBin i okudu ve onceki buludugu oku degiskenini bunun sagina ekledi ve 
        #BesYuzOtuzBesBinYediYuzYetmisAlti olustu.
        else:
            oku = ucHaneOku(sayi[-1*((i*3)+3)]+sayi[-1*((i*3)+2)]+sayi[-1*((i*3)+1)]) + ucluGrub[str(i)] + oku
    #Enson olarak olusturulan bu oku degeri ekrana yazdiriliyor.
    
    return oku

