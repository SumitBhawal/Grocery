const mongoose = require('mongoose');
const express = require('express');
const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/groceries', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


const grocerySchema = new mongoose.Schema({

    groceryItem: {
        type: String,
        required: true
    },
    isPurchased: {
        type: Boolean,
        required: true,
        default: false
    }
}, { versionKey: false });

var GroceryItem = mongoose.model('GroceryItem', grocerySchema);

// item:groceryItem.item,
// purchasestatus: groceryItem.ispurchased

app.post('/grocery/add', (req, res) => {
    var addgrocery = new GroceryItem({
        groceryItem: req.body.item,
    });

    addgrocery.save().then((docs) => {
        console.log('Success', docs)
    }, (err) => {
        console.log(err)
    })
    res.json({ result: 'Success' })
});

app.get('/grocery/getall', function (req, res) {
    GroceryItem.find({}, (err, data) => {
        res.json(data)
    })
});

app.put('/grocery/updatePurchaseStatus', function (req, res) {

    GroceryItem.findOneAndUpdate({ _id: req.body._id }, { isPurchased: req.body.purchasestatus }, { returnOriginal: false }).then((result) => {
       console.log('Success', result)
        res.json(result);
    });
});

app.delete('/grocery/deleteGroceryItem', function (req, res) {

    GroceryItem.deleteOne({ _id: req.body._id }).then((result) => {
        console.log(result);
        res.json(result);
    }, (err) => console.log(err));
})


app.listen('8080', () => {
    console.log('app started');
});