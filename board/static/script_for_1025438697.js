async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  }

const input_ = document.getElementById("input_");
input_.addEventListener("input", () => {

    var txt = input_.value;
    txt = txt.toString().toLowerCase().replaceAll(" ","")

    var currentdate = new Date(); 
    var x = ((currentdate.getDate())%2).toString();
    var y = ((currentdate.getMonth()+1)%2).toString();
    var z = ((currentdate.getHours())%2).toString();
    var t = ((currentdate.getMinutes())%2).toString();

    var timestamp = "_"+x+y+z+t;

    var list = {
        _1111:'4bd2bdec656a357033cf798fed08acabbfa198efe6465280d838d9c0e106784c',
        _1110:'3f875e61e803975857ded15d191305eec701be11a0efdcfd37499abc80e38b41',
        _1101:'d81e34462676409064f010486f6088851b7e2ab4dcb18ac9b62de58d83214b60',
        _1100:'a65d11fd6c755512701a15d2473ad746ef8bd99300c0aeca82f878f9a3ad3fef',
        _1011:'e8fec83f0024ba13bdc10481593dfdbb20138a8f6eb7fa1c93eebb558b93151f',
        _1010:'522748b75f1a7405a8c7846d4d4647715346854b384ebd6bd851e3424159f4c3',
        _1001:'a7a8ccf9c61056ad8b99be0b7863b8c59bd0fc4452d20edb0e352ea061d008a7',
        _1000:'dd1b7a4e48d5c3015a6c5388cabb8fb2769e5aacb60d0791b8c25e6fddea1306',
        _0111:'1abfc748d1a4f5e01c729b5e6cbf54f62ce11a87ebeda467cd3228d8b0e9addc',
        _0110:'b0d8d54a62225dfbfa5cd1c768fde264bc4553cdc560aca2e79e17cb7371f72a',
        _0101:'2bcb0f3e6c38bcb1ba8de07e4758512a8736377b2518158cd4d875951aa90cb9',
        _0100:'b6ae59a8d01f0ee4322cc7c735c2b19ce16f99bc30cbae6c9f052668b0b254d6',
        _0011:'69655e5a2972db0fb74e46ec5261c6823187d8ec391959d939c2b0fe0ef2352f',
        _0010:'07a7c03158d17e73acacd2319ecee2aa7b90db912ac30491b7a3d8b1ab2111bd',
        _0001:'4dca6690d22aecc18cc4209a13662d488a1bc93780753b301f99eea70de01cb9',
        _0000:'63847231f3097a8fa91b105842a3672231983dbbd7c311b5d44b0e9793c3ecba'
    };

    // ? That part used only once for creating hash list. I didn't want to delete it :)
    /*const keys = Object.keys(list);
    for (let i = 0; i < 16; i++) {
        let element = list[keys[i]];
        element = element.toString().toLowerCase().replaceAll(" ","");
        console.log(element);
        hash(element).then((hex) => {
            console.log(keys[i] + ":'" + hex +"',");
        });
    }*/

    hash(txt).then((hex) => {
        console.log(list[timestamp],hex)        
        if (list[timestamp] == hex) {
            window.alert("Congratulations! You have been succeeded.\n Tell the creator of this mess what you found in the book.");
        }
    }); 
});