const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

//inicio do teste

  

//fim do teste

/**
 * 
 * Check Login
 */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/admin'); // Redirecionar para a página de login
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;

        // Verificar se o token está prestes a expirar
        const now = Math.floor(Date.now() / 1000); // Tempo atual em segundos
        const expiresAt = decoded.exp; // Tempo de expiração do token
        const timeRemaining = expiresAt - now;
       
        if (timeRemaining < 60) {
            // Se o token estiver prestes a expirar (menos de 60 segundos restantes), redirecione para a página de login
            return res.redirect('/admin');
        }
        next();
    } catch (error) {
        return res.redirect('/admin'); // Redirecionar para a página de login em caso de token inválido
    }
}


/**
 * GET /
 * Admin - Login Page
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error){
        console.log(error);
    }
});


/**
 * POST /
 * Admin - Check Login
 */
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne( { username } ); 
        //Minhas Alterações
        if(!user) {
            // Renderizar a página de login com uma mensagem de erro
            const locals = {
                title: "Admin",
                description: "Simple Blog created with NodeJs, Express & MongoDb.",
                errorMessage: 'User not found. Please check your credentials.'
            };
            return res.render('admin/index', { locals, layout: adminLayout });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        //Alterações nas mensagens de erro login, na pagina
        if(!isPasswordValid) {
            // Renderizar a página de login com uma mensagem de erro
            const locals = {
                title: "Admin",
                description: "Simple Blog created with NodeJs, Express & MongoDb.",
                errorMessage: 'Invalid password. Please check your credentials.'
            };
            return res.render('admin/index', { locals, layout: adminLayout });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret) 
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/dashboard');
    //Mais alterações para mensagens de erro   
    } catch (error){
        console.log(error);

        // Renderizar a página de login com uma mensagem de erro genérica
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb.",            
            errorMessage: 'An error occurred. Please try again later.'
        };
        return res.render('admin/index', { locals, layout: adminLayout });
    }
});



/**
 * GET /
 * Admin - Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "dashboard",
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
           
    }
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error)
    }
});


/**
 * GET /
 * Admin - Create New Post
 */
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
    }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error)
    }
});


/**
 * POST /
 * Admin - Create New Post
 */
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new Post ({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }       

    } catch (error) {
        console.log(error)
    }
});


/**
 * GET /
 * Admin - Edit Post
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
    };
      
        const data = await Post.findOne({ _id: req.params.id });

       res.render('admin/edit-post', {
        locals,
        data,
        layout: adminLayout
       })

    } catch (error) {
        console.log(error)
    }
});



/**
 * PUT /
 * Admin - Edit Post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
   
       await Post.findByIdAndUpdate(req.params.id,{
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
       });

       res.redirect(`/post/${req.params.id }`);

    } catch (error) {
        console.log(error)
    }
});



/**
 * DELETE /
 * Admin - Delete Post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne( { _id: req.params.id } );
        res.redirect('/dashboard');
    } catch (error) {
    console.log(error);
    }
});


/**
 * GET /
 * Admin - Logout
 */
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout sucessful.' });
    res.redirect('/');
})


//router.post('/admin', async (req, res) => {
//    try {
//        const { username, password } = req.body;
//        
//        if(req.body.username === 'admin' && req.body.password === 'password') {
//            res.send('You are logged in.') 
//        } else {
//            res.send('Wrong username or password');
//        }
//    } catch (error){
//        console.log(error);
//    }
//});




/**
 * POST /
 * Admin - Register
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        try {
            const user = await User.create({ username, password:hashedPassword });

        //Geração do token
        const token = jwt.sign({ userId: user._id }, jwtSecret);
        //Definir o token no cookie
        res.cookie('token', token, { httpOnly: true });
        //Redirecionar para a área restrita (por exemplo, dashboard)
        res.redirect('/dashboard');
  
    //Minhas Modificações    
    } catch (error) {
        if (error.code === 11000) {
            // Renderizar a página de registro com uma mensagem de erro
            const locals = {
                title: "Admin",
                description: "Simple Blog created with NodeJs, Express & MongoDb.",
                errorMessage: 'Username already in use. Please choose a different username.'
            };
            return res.render('admin/index', { locals, layout: adminLayout });
        }
        // Renderizar a página de registro com uma mensagem de erro genérica
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
            errorMessage: 'An error occurred. Please try again later.'
        };
        return res.render('admin/index', { locals, layout: adminLayout });
    }
             
        } catch (error){
        console.log(error);
    }
});

module.exports = router;