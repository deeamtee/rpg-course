export class Entity extends Phaser.Physics.Arcade.Sprite {
    health: number;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, type?: string) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.health = 100;
    }

    
    protected createAnimation (
        key: string,
        textureKey: string,
        start: number,
        end: number,
        anims: Phaser.Animations.AnimationManager,
        frameRate: number,
        repeat: number = -1
    ) {
        anims.create({
            key,
            frames: anims.generateFrameNumbers(textureKey, {
                start,
                end
            }),
            frameRate,
            repeat
        })
    }

    takeDamage (damage: number) {
        if (this.health > 0) {
            this.health -= damage;
        }
    }
}