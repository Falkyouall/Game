window.onload = function () {
    var innerWidth = window.innerWidth;
    var innerHeight = window.innerHeight;
    var gameRatio = innerWidth / innerHeight;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});
    var score = 0;
    var scoreText;
    var platforms;
    var player;
    var health = 100;

    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.setScreenSize(true);
        game.load.image('sky', 'assets/sky.png');
        game.load.image('ground', 'assets/platform.png');
        game.load.image('star', 'assets/star.png');
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    }


    function create() {
        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Height of the World
        game.world.height = 900;
        console.log(game.world.height);
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');
        //  The platforms group contains the ground and the 2 ledges we can jump on
        platforms = game.add.group();
        //  We will enable physics for any object that is created in this group
        platforms.enableBody = true;

        // Here we create the ground.
        ground = platforms.create(0, game.world.height - 600, 'ground');


        


        //Player and his settings
        player = game.add.sprite(100, game.world.height - 750, 'dude');
        // Enabeling Physics on player
        game.physics.arcade.enable(player);
        //Player Physics
        player.body.bounce.y = 0;
        player.body.gravity.y = 999;
        player.body.collideWorldBounds = true;

        // Player Animations
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        stars = game.add.group();
        stars.enableBody = true;
        for (var i = 0; i < 12; i++) {
            var star = stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 300;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        // Score Anzeige
        scoreText = game.add.text(16, 16, 'score: ' + score, {fontSize: '32px', fill: '#fff'});
        //Lebensanzeige
        healthText = game.add.text(300, 16, 'lives: ' + health, {fontSize: '25px', fill: '#fff'});
        // Our Keyboard Manager
        cursors = game.input.keyboard.createCursorKeys();

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        //var ledge = platforms.create(400, 400, 'ground');
        // ledge.body.collideWorldBounds = true;
        // ledge.body.immovable = true;

        var jplattform = platforms.create(-150, 250, 'ground');
        // ledge.body.collideWorldBounds = true;
        jplattform.body.immovable = true;


    }


    function update() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.overlap(player, stars, collectStar, null, this);
        game.physics.arcade.overlap(player, ground);

        
        console.log(player.sprite.body);
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -350;
        }
        // Get Players falling speed
        speed = player.body.velocity.y;
        // give feedback if when collision was too fast
        if (speed > 300) {
            health--;
            healthText.text = 'lives:' + health;
            console.log('this is way too fast: ' + speed + ' ms');
        }



    }
    function collectStar(player, star) {
        // Removes the star from the screen
        star.kill();
        scoreText.text = 'Score' + score++;
    }
};