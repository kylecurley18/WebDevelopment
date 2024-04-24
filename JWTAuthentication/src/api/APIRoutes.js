const express = require('express');
const cookieParser = require('cookie-parser');

const apiRouter = express.Router();

apiRouter.use(cookieParser());
apiRouter.use(express.json());

const {TokenMiddleware, generateToken, removeToken} = require('../middleware/TokenMiddleware');

/************\
* API ROUTES *
\************/

const CountyDAO = require('./db/CountyDAO');
const ParkDAO = require('./db/ParkDAO');
const UserDAO = require('./db/UserDAO');

//Get all counties
apiRouter.get('/counties', TokenMiddleware, (req,  res) => {
  CountyDAO.getCounties().then(counties => {
    res.json(counties);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});
//Get all parks
apiRouter.get('/parks', TokenMiddleware, (req,  res) => {
  ParkDAO.getParks().then(parks => {
    res.json(parks);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});
//Get specific park
apiRouter.get('/parks/:parkId', TokenMiddleware, (req,  res) => {
  const parkId = req.params.parkId;
  ParkDAO.getParkById(parkId).then(park => {
    // We could log the visited park here
    res.json(park);
  })
  .catch(err => {
    res.status(404).json({error: 'Park not found'});
  });
});

//Get all parks in specific county
apiRouter.get('/counties/:countyId/parks', TokenMiddleware, (req,  res) => {
  const countyId = req.params.countyId;
  ParkDAO.getParksByCountyId(countyId).then(parks => {
    res.json(parks);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});
//Get specific county
apiRouter.get('/counties/:countyId', TokenMiddleware, (req,  res) => {
  const countyParam = req.params.countyId;
  CountyDAO.getCounty(countyParam).then(county => {
    if(county) {
      res.json(county);
    }
    else {
      res.status(404).json({error: 'County not found'});
    }
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});


//Create a park
apiRouter.post('/parks', TokenMiddleware,  (req,  res) => {
  let newPark = req.body;
  ParkDAO.createPark(newPark).then(park => {
    res.json(park);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});
//Create a county
apiRouter.post('/counties', TokenMiddleware, (req,  res) => {
  let newCounty = req.body;
  CountyDAO.createCounty(newCounty).then(county => {
    res.json(county);
  })
  .catch(err => {
    res.status(500).json({error: 'Internal server error'});
  });
});


//Update a county
apiRouter.put('/counties/:countyId', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});
//Update a park
apiRouter.put('/parks/:parkId', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});


//Delete a county
apiRouter.delete('/counties/:countyId', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});
//Delete a park
apiRouter.delete('/parks/:parkId', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});




/* USER ROUTES */

apiRouter.post('/users/login', (req,  res) => {
  if(req.body.username && req.body.password) {
    UserDAO.getUserByCredentials(req.body.username, req.body.password).then(user => {
      let result = {
        user: user
      }

      generateToken(req, res, user);

      res.json(result);
    }).catch(err => {
      console.log(err);
      res.status(err.code).json({error: err.message});
    });
  }
  else {
    res.status(401).json({error: 'Not authenticated'});
  }
});

apiRouter.post('/users/logout', (req,  res) => {
  removeToken(req, res);

  res.json({success: true});
});


apiRouter.get('/users/current', TokenMiddleware, (req,  res) => {
  res.json(req.user);
});

apiRouter.get('/users/current/parks', TokenMiddleware, (req,  res) => {
  res.status(501).json({error: 'Not implemented'});
});


module.exports = apiRouter;
