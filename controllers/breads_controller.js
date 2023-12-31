const express = require('express')
const breads = express.Router()

// somewhere at the top with the other dependencies 
const Baker = require('../models/baker.js')

//Load in Data from Models
const Bread = require('../models/bread.js')

// INDEX
breads.get('/', (req, res) => {
  Baker.find()
   .then(foundBakers => {
     Bread.find()
      .then(foundBreads => {
          res.render('index', {
            breads: foundBreads,
             bakers: foundBakers,
           title: 'Index Page'
        })
      })
    })
  })


// in the new route
breads.get('/new', (req, res) => {
  Baker.find()
      .then(foundBakers => {
          res.render('new', {
              bakers: foundBakers
          })
    })
})

// EDIT
breads.get('/:id/edit', (req, res) => {
  Baker.find()
  .then(foundBakers => { 
    Bread.findById (req.params.id)
    .then(foundBread => {
      res.render('edit', {
        bread:foundBread,
        bakers: foundBakers
         })
 
       })
    })
})


// SHOW
breads.get('/:id', (req, res) => {
  Bread.findById(req.params.id)
     .populate ('baker')
      .then(foundBread => {
        const bakedBy = foundBread.getBakedBy ()
        console.log(bakedBy)
          res.render('show', {
              bread: foundBread
          })
      })
      .catch(err => {
        res.send('404')
      })
})


// CREATE a bread
breads.post('/', (req, res) => {
  if (!req.body.image) {
    req.body.image = undefined
    }
      if(req.body.hasGluten === 'on') {
         req.body.hasGluten = true
      }      else {
        req.body.hasGluten = false
  }
    Bread.create(req.body)
       res.redirect('/breads')
})
  
// DELETE a bread
breads.delete('/:indexArray', (req, res) => 
 {
  Bread.findByIdAndDelete(req.params.id)
    .then(deletedBread => 
      {
      res.status(303).redirect('/breads')
        })  
          })

// UPDATE
breads.put('/:id', (req, res) => {
  if(req.body.hasGluten === 'on'){
    req.body.hasGluten = true
  } else {
    req.body.hasGluten = false
  }
  Bread.findByIdAndUpdate(req.params.id, req.body, { new: true }) 
    .then(updatedBread => {
      console.log(updatedBread) 
      res.redirect(`/breads/${req.params.id}`) 
    })
})



module.exports = breads



