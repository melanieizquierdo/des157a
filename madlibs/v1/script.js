(function () {

    "use strict";

    console.log("reading js");

    const form = document.querySelector('#madlibsForm');

    form.addEventListener('submit', function(event){

        event.preventDefault();

        const textPieces = document.querySelectorAll('.blur-text');

        textPieces.forEach(function(piece){

            piece.classList.add('reveal');

        });

    });

})();