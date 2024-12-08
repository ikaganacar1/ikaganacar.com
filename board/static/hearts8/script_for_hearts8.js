const input_ = document.getElementById("input_");


$(document).ready(function(){
    $.getJSON("./static/hearts8.json", function(data){

        if (input_) {
            input_.addEventListener("input", () => {
        
                var txt = (input_.value).toUpperCase();
                
                if (txt.length == 6) {
                    //there will be 51 diffirent codes (for each card of the deck)(except ♥8)
                    
                    for (const symbol in data){
                        for (const number in data[symbol]){
                            if (txt == data[symbol][number].code) {
                                window.open(data[symbol][number].link,"_blank")
                            }
                        }
                    }
                }
            });
        }
    }).fail(function(){
        console.log("json not found.");
    });
});



