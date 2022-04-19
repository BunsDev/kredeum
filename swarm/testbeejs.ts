import { Bee } from "@ethersphere/bee-js";

const bee = new Bee('http://localhost:1633');

const test = async() => {

    const result = await bee.uploadData(
        "a2fae7a4314c63436d2a575296afe35496bdaa12141c2b73e068c2d175c6ad7c",
        "Bee is awesome!"
    );
    console.log("data upload reference", result.reference);
    const retrievedData = await bee.downloadData(result.reference);
    console.log("I really hope that", retrievedData.text()); // prints 'Bee is awesome!'
}

test();