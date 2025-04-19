import { Entity } from "./entity";

export class Enemy extends Entity {
    private player: Entity;
    private initialPosition: { x: number; y: number };
    private isFollowing: boolean;
    private agroDistance: number;
    private followRange: number;
    private attackRange: number;
    private isAlive: boolean;
    private moveSpeed: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        
        this.initialPosition = { x, y };

        this.isFollowing = false;
        this.agroDistance = 100;
        this.isAlive = true;
        this.moveSpeed = 100;
        this.attackRange = 40;
        this.followRange = 250;

        this.cycleTween();
        this.setFlipX(true)
    }

    cycleTween () {
        this.scene.tweens.add({
            targets: this,
            duration: 2000,
            repeat: -1,
            yoyo: true,
            x: this.x + 100,
            onRepeat: () => {
                this.setFlipX(true);
            },
            onYoyo: () => {
                this.setFlipX(false);
            }
        })
    }

    setPlayer (player: Entity) {
        this.player = player;
    }

    stopCycleTween() {
        this.scene.tweens.killTweensOf(this);
    }

    followToPlayer(player) {
        this.scene.physics.moveToObject(this, player, this.moveSpeed)
    }

    returnToOriginalPosition(distanceToPosition) {
        this.setVelocity(0,0);

        this.scene.tweens.add({
            targets: this,
            x: this.initialPosition.x,
            y: this.initialPosition.y,
            duration: distanceToPosition * 1000 / this.moveSpeed, 
            onComplete: () => {
                this.cycleTween();
            }
        })
    }

    update() {
        // 1. Расчет дистанции до персонажа
        const player = this.player;
        const distanceToPlayer = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        const distanceToPosition = Phaser.Math.Distance.Between(this.x, this.y, this.initialPosition.x, this.initialPosition.y);
        // 2. Остановка цикла, включение режима следования
        if(!this.isFollowing && distanceToPlayer < this.agroDistance) {
            this.isFollowing = true;
            this.stopCycleTween();
        }
        // 3. Режим следования
        if (this.isFollowing && this.isAlive) {
            this.followToPlayer(player);
            // 3.1 Начало файтинга
            if (distanceToPlayer < this.attackRange) {
                this.setVelocity(0,0);
            }
            // 3.2 Возврат на исходную, если расстояние больше followRange
            if (distanceToPosition > this.followRange) {
                this.isFollowing = false;
                this.returnToOriginalPosition(distanceToPosition);
            }
        }
    }
}