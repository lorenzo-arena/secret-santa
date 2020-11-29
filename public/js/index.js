particlesJS.load('particles-js', 'assets/particles.json', function() {
  console.log('callback - particles.js config loaded');
});

const onSantaClicked = async () => {
    document.getElementById("santa-spinner").style.visibility = "visible";
    $('#santaModal').modal('show');

    try {
        const name = document.getElementById("santa-input").value;
        const response = await fetch(`/link/${name}`);

        console.log(response.status);
        if(response.status != 200) {
            throw 'Error!';
        }
        const responseJSON = await response.json();

        if(responseJSON) {
            if(responseJSON.read) {
                document.getElementById("santa-label").innerText = 'Questo Babbo Natale è già stato richiesto!';    
            } else {
                document.getElementById("santa-label").innerText = responseJSON.link.toLocaleUpperCase();
            }
        } else {
            throw 'Error!';
        }
    } catch(e) {
        document.getElementById("santa-spinner").style.visibility = "hidden";
        document.getElementById("santa-label").innerText = e;
    }

    document.getElementById("santa-spinner").style.visibility = "hidden";
}