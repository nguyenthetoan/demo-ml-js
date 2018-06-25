import brain from 'brain.js';

let trainedNet;

export function train(data) {
    let net = new brain.recurrent.LSTM();
    net.train(data);
    trainedNet = net.toJSON();
    console.log('Finished training...');
};

export function execute(input) {
    let net = new brain.NeuralNetwork();
    net.fromJSON(trainedNet);
    let results = net.run(input);
    console.log(results)
    let output;
    let certainty;
    if (results.hate > results.normal) {
        output = 'normal state'
        console.log();
    } else {
        output = 'rip'
        certainty = Math.floor(results.normal * 100)
    }

    return "I'm " + certainty + "% sure that she is " + output;
}
