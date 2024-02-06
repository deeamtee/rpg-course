import { SPRITES } from "../utils/constants";
import { Entity } from "./entity";

export class Player extends Entity  {
    textureKey: string;
    private moveSpeed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture, SPRITES.PLAYER);

        const anims = this.scene.anims;
        const animsFrameRate = 9;
        this.textureKey = texture;
        this.moveSpeed = 50;
        this.setSize(28, 32);
        this.setOffset(10, 16);
        this.setScale(0.8);

        anims.create({
            key: 'down',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 0,
                end: 2
            }),
            frameRate: animsFrameRate,
            repeat: -1
        })

        anims.create({
            key: 'left',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 12,
                end: 14
            }),
            frameRate: animsFrameRate,
            repeat: -1
        })

        anims.create({
            key: 'right',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 24,
                end: 26
            }),
            frameRate: animsFrameRate,
            repeat: -1
        })

        anims.create({
            key: 'up',
            frames: anims.generateFrameNumbers(this.textureKey, {
                start: 36,
                end: 38
            }),
            frameRate: animsFrameRate,
            repeat: -1
        })
    }

    update(delta: number) {
        const keys = this.scene.input.keyboard.createCursorKeys();

        if (keys.up.isDown) {
            this.play('up', true);
            this.setVelocity(0, -delta * this.moveSpeed)
        } else if (keys.down.isDown) {
            this.play('down', true);
            this.setVelocity(0, delta * this.moveSpeed)
        } else if (keys.left.isDown) {
            this.play('left', true);
            this.setVelocity(-delta * this.moveSpeed, 0)
        } else if (keys.right.isDown) {
            this.play('right', true);
            this.setVelocity(delta * this.moveSpeed, 0)
        } else {
            this.setVelocity(0, 0);
            this.stop();
        }
    }
}