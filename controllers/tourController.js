const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`) // /../ bir klasör üste çık demek
);

//param middleware
exports.checkID = (req, res, next, val) => {
  //console.log(`Tour ID is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    // burada return unutulursa aşağıdaki response döner next() ile bir sonraki middleware'e gider
    // ve varsa orada başka bir response dönmeye çalışır. Burada çoktan response dönüldüğü için
    // oradaki response'u dönemez ve error oluşur. Return işlerse asla next() işlemeyecektir.
    return res.status(404).json({
      status: 'fail',
      message: 'invaid ID',
    });
  }

  next();
};

// Create a checkBody middleware
// Check if body contains the name and price property
// If not, send back 400 (bad request) code
// Add it to the post handler stack
exports.checkBody = (req, res, next) => {
  //console.log(req.body);

  if (!req.body.name || !req.body.price)
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price!',
    });

  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success', //success, fail, error
    requestedAt: req.requestTime,
    results: tours.length, //json standardında bu alan genelde olmaz ama client tarafında işe yarayabilir diye yollanıyor
    data: {
      //tours: tours, //ES6'de aynı isimlileri yazmaya gerek yok ama standart olarak yazılabilir.
      tours,
    },
  });
};

exports.getTour = (req, res) => {
  //console.log(req.params);

  const id = req.params.id * 1; //string to number işlemi. Burada çoklu parametre olsaydı (x ve y) .x ve .y ile erişecektik
  //const id = Number(req.params);

  //tours dizisinin tüm elemanlarını tek tek "el" içine alır. el.id'si id'ye eşitse o öğeyi döner. Yoksa undefined döner
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success', //success, fail, error
    // results: tours.length, //json standardında bu alan genelde olmaz ama client tarafında işe yarayabilir diye yollanıyor
    data: {
      tour,
    },
  });
};

//create a new tour (client to server)
exports.createTour = (req, res) => {
  //console.log(req.body); //middleware'den gelen özellik. Tepeden kapatılırsa "undefined" olarak log'lanır

  const newId = tours[tours.length - 1].id + 1; //tours[8].id alınıp 1 fazlası newId'ye atandı
  const newTour = Object.assign({ id: newId }, req.body); //req.body alınıp içine { id: newId } keyi eklendi

  tours.push(newTour); //newTour tours içine eklendi (push)
  // event loop içinde olduğumuzdan sync versiyon kullanmayacağız. Sadece yukarda top level kodda kullandık
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // 200 kodu "ok", 201 kodu "created", 404 "not found" demek
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// Update Tour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

// Delete Tour
exports.deleteTour = (req, res) => {
  // 204 kodu "no content" demek
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//exports. şeklinde yazılan fonksiyonlar dosya dışına erişime açılmış demektir.
