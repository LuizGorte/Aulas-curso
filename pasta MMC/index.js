const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mdc(a, b) {
    if (b === 0) {
        return a;
    } else {
        return mdc(b, a % b);
    }
}

function mmc(a, b) {
    return Math.abs(a * b) / mdc(a, b);
}

rl.question('Digite o primeiro número: ', (num1) => {
    rl.question('Digite o segundo número: ', (num2) => {
        
        num1 = parseInt(num1);
        num2 = parseInt(num2);

        let resultadoMDC = mdc(num1, num2);
        let resultadoMMC = mmc(num1, num2);

        console.log(`Você escolheu os números ${num1} e ${num2}.`);
        console.log(`MDC de ${num1} e ${num2} é: ${resultadoMDC}`);
        console.log(`MMC de ${num1} e ${num2} é: ${resultadoMMC}`);

        rl.close();
    });
});