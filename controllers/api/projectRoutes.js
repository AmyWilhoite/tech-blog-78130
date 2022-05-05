const router = require('express').Router();
// const { request } = require('express');
const { Project } = require('../../models');
const withAuth = require('../../utils/auth');
const { readAndAppend, readFromFile } = require('../../utils/fsUtils');

router.get('/', (req, res) =>
  readFromFile('./seeds/projectData.json').then((data) => res.json(JSON.parse(data)))
);

//post working just not rendering new stuff with out running seeds 
router.post('/', withAuth, async (req, res) => {
  console.log(req.body);
  const {name, description} = req.body; 
  if (req.body) {
      // try posting 
      const newProject = {
        name,
        description
      };

      readAndAppend(newProject, './seeds/projectData.json');

      res.json(` added successfully 🚀`);
    } else {
      res.error('Error in adding Blog Post');
    }
});


router.delete('/:id', withAuth, async (req, res) => {
  try {
    const projectData = await Project.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!projectData) {
      res.status(404).json({ message: 'No project found with this id!' });
      return;
    }

    res.status(200).json(projectData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.delete('/:id', withAuth, async (req, res) => {
//   try {
//     const projectData = await Project.destroy({
//       where: {
//         id: req.params.id,
//         user_id: req.session.user_id,
//       },
//     });

//     if (!projectData) {
//       res.status(404).json({ message: 'No project found with this id!' });
//       return;
//     }

//     res.status(200).json(projectData);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
