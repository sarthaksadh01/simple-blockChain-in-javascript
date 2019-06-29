
class BlockChain {

    constructor() {
        this.chain = [];
        this.createBlock()
    }

    getPrevBlock() {
        return this.chain[this.chain.length - 1];
    }

    getChain() {
        return this.chain;
    }


    isChainValid() {
        var list = [1];
        var faultIndex = -1;
        console.log(this.chain.length)
        for (var i = 1; i < this.chain.length; i++) {
            if (this.chain[i].prevHash != this.chain[i - 1].hash) {
                faultIndex = i;
                break; s
            }

            else
                list.push(1);
        }

        if (faultIndex == -1)
            return list;
        for (var i = faultIndex; i < this.chain.length; i++)list.push(0);
        return list;
    }

    createBlock(nonce = 1, prevHash = '0'.repeat(64), data = "Genesis Block", hash = sha256('1' + "randomData" + '0' + '0')) {

        this.chain.push({
            nonce,
            index: this.chain.length,
            data,
            prevHash,
            hash,
            timeStamp: Date().toString()
        })

    }

    editBlock(nonce, prevHash, newData, hash, index) {

        this.chain[index] = {
            nonce,
            index,
            data: newData,
            prevHash,
            hash,
            timeStamp: Date().toString()
        }

    }

}

function mine(blockChainVariable, data, difficulty) {
    var nonce = 1;
    var chain = blockChainVariable.getChain();
    var index = chain.length;
    var prevBlock = chain[index - 1];
    var hash = sha256(nonce + data + index + prevBlock.hash)
    console.log("mining block -- " + index);
    while (hash.substring(0, difficulty) != '0'.repeat(difficulty)) {
        nonce += 1;
        hash = sha256(nonce + data + index + prevBlock.hash);
    }

    blockChainVariable.createBlock(nonce, prevBlock.hash, data, hash);



}




function mineAgain(index, blockChainVariable, newData, difficulty) {
    console.log("mining block again -- " + index);
    var nonce = 1;
    var chain = blockChainVariable.getChain();
    var prevBlock,prevHash;
    if(index!=0){
        prevBlock = chain[index - 1];
        prevHash=prevBlock.hash;
    }
    else{
        prevBlock=chain[index];
        prevHash=prevBlock.prevHash;
    }

    var hash = sha256(nonce + newData + index + prevHash)
    while (hash.substring(0, difficulty) != '0'.repeat(difficulty)) {
        nonce += 1;
        hash = sha256(nonce + newData + index + prevHash);
    }

    blockChainVariable.editBlock(nonce, prevHash, newData, hash, index);
    // console.log(blockChainVariable.isChainValid())


}




var blockchain = new BlockChain();
showBlocks()
var flag=0;
function insertBlockButton() {

    var val = $("#valueofdata").val().trim()
    if (val != ""&&flag==0) {
        var isValid = blockchain.isChainValid();
        for(var i=0;i<isValid.length;i++){
            if(isValid[i]==0){
                alert("Error... Chain no longer valid")
                return;
            }
        }
        flag=1;
        mine(blockchain, val, 4);
        $('#exampleModal').modal('hide')
        flag=0;
        showBlocks();
        $("#valueofdata").val("")


    }
    else {
        alert("please enter data");
    }



}

function showBlocks(){

    var chain =blockchain.getChain();
    var toShow="";
    for(var i=0;i<chain.length;i++){
        toShow+= `
        <div class="col-md-4">
                <div class="card border-success mb-3" style="max-width: 18rem;">
                    <div class="card-header">Block No: #${i+1}</div>
                    <div class="card-body text-primary">
                        <h5 class="card-title">Nonce: ${chain[i].nonce}</h5>
                        <textarea class="form-control" id="${i.toString()}" rows="7">${chain[i].data}</textarea>
                    </div>
                    <div class="card-footer">Hash: <span
                            class="text-muted">#${chain[i].hash}</span>
                        <br>Prev-hash <span class="text-muted">
                            #${chain[i].prevHash}
                        </span><br><button  onclick="miningButton(${i.toString()})" class="text-white btn btn-warning">Mine</button></div>
                </div>
            </div>
        `
    }
    $("#sadh").html(toShow);
    
}

function miningButton(id){
    var newData=$("#"+id).val();
    mineAgain(parseInt(id),blockchain,newData,4)
    showBlocksIfMinedAgain();

}

function showBlocksIfMinedAgain(){

    var chain =blockchain.getChain();
    var err = blockchain.isChainValid();
    var toShow="";
    for(var i=0;i<chain.length;i++){
        if(err[i]==1)
        toShow+= `
        <div class="col-md-4">
                <div class="card border-success mb-3" style="max-width: 18rem;">
                    <div class="card-header">Block No: #${i+1}</div>
                    <div class="card-body text-primary">
                        <h5 class="card-title">Nonce: ${chain[i].nonce}</h5>
                        <textarea class="form-control" id="${i.toString()}" rows="7">${chain[i].data}</textarea>
                    </div>
                    <div class="card-footer">Hash: <span
                            class="text-muted">#${chain[i].hash}</span>
                        <br>Prev-hash <span class="text-muted">
                            #${chain[i].prevHash}
                        </span><br><button onclick="miningButton(${i.toString()})" class="text-white btn btn-warning">Mine</button></div>
                </div>
            </div>
        `;
        else{

            toShow+= `
            <div class="col-md-4">
                    <div class="card border-danger mb-3" style="max-width: 18rem;">
                        <div class="card-header">Block No: #${i+1}</div>
                        <div class="card-body text-primary">
                            <h5 class="card-title">Nonce: ${chain[i].nonce}</h5>
                            <textarea class="form-control" id="${i.toString()}" rows="7">${chain[i].data}</textarea>
                        </div>
                        <div class="card-footer">Hash: <span
                                class="text-muted">#${chain[i].hash}</span>
                            <br>Prev-hash <span class="text-muted">
                                #${chain[i].prevHash}
                            </span><br><button onclick="miningButton(${i.toString()})" class="text-white btn btn-warning">Mine</button></div>
                    </div>
                </div>
            `;
            
        }
    }
    $("#sadh").html(toShow);
    
}
