import { XYPosition } from "reactflow";
import AnimalGroup from "../../compositions/AnimalGroup";
import Animal from "../../entities/unit/Animal";

class FollowLeaderTreeStrategyBackup {
  private group: AnimalGroup;

  constructor(group: AnimalGroup) {
    this.group = group;
  }

  getPositionsForMembers(): [Animal, XYPosition][] {
    const leader = this.group.accessLeader;
    const sortedMembers = this.group.accessSortedMembers;

    if (!leader || sortedMembers.length === 0) return [];

    const fibonacciSequence = this.generateFibonacciSequence(
      sortedMembers.length
    );

    let currentIndex = 0;
    const positions: [Animal, XYPosition][] = [];

    const rootPosition = leader.position;
    const verticalSpacing = 100; // Adjust the vertical spacing between levels
    const horizontalSpacing = 50; // Adjust the horizontal spacing between nodes

    for (const num of fibonacciSequence) {
      const followerIndices = Array.from(
        { length: num },
        (_, index) => currentIndex + index + 1
      );

      if (followerIndices.length === 0) break;

      const followers = followerIndices
        .map((index) => sortedMembers[index])
        .filter(Boolean);

      const numFollowers = followers.length;
      const startY = rootPosition.y + verticalSpacing;

      for (let i = 0; i < numFollowers; i++) {
        const follower = followers[i];
        const targetX =
          rootPosition.x +
          (i - Math.floor(numFollowers / 2)) * horizontalSpacing;
        const targetY = startY + verticalSpacing;

        if (follower instanceof Animal) {
          positions.push([follower, { x: targetX, y: targetY }]);
        }
      }

      currentIndex += num;
      rootPosition.y += verticalSpacing;
    }

    return positions;
  }

  private generateFibonacciSequence(length: number): number[] {
    const sequence: number[] = [];

    let a = 1;
    let b = 1;

    while (length > 0) {
      sequence.push(a);
      const temp = a;
      a = b;
      b = temp + b;
      length -= 1;
    }

    return sequence;
  }
}

export default FollowLeaderTreeStrategyBackup;

/*
import { XYPosition } from "reactflow";
import AnimalGroup from "../../compositions/AnimalGroup";
import Animal from "../../entities/unit/Animal";

class FollowLeaderTreeStrategy {
  private group: AnimalGroup;

  constructor(group: AnimalGroup) {
    this.group = group;
  }

  getPositionsForMembers(): [Animal, XYPosition][] {
    const leader = this.group.accessLeader;
    const sortedMembers = this.group.accessSortedMembers;

    if (!leader || sortedMembers.length === 0) return [];

    const fibonacciSequence = this.generateFibonacciSequence(
      sortedMembers.length
    );

    let currentIndex = 0;
    const positions: [Animal, XYPosition][] = [];

    for (const num of fibonacciSequence) {
      const followerIndices = Array.from(
        { length: num },
        (_, index) => currentIndex + index + 1
      );

      if (followerIndices.length === 0) break;

      const followers = followerIndices
        .map((index) => sortedMembers[index])
        .filter(Boolean);

      followers.forEach((follower, index) => {
        const targetUnit = followers[index - 1] || leader;
        if (follower instanceof Animal && targetUnit) {
          const targetPosition = this.calculateTargetPosition(
            targetUnit.position,
            index
          );
          positions.push([follower, targetPosition]);
        }
      });

      currentIndex += num;
    }

    return positions;
  }

  private calculateTargetPosition(
    previousPosition: XYPosition,
    index: number
  ): XYPosition {
    return {
      x: previousPosition.x - (index + 1) * 100,
      y: previousPosition.y,
    };
  }

  private generateFibonacciSequence(length: number): number[] {
    const sequence: number[] = [];

    let a = 1;
    let b = 1;

    while (length > 0) {
      sequence.push(a);
      const temp = a;
      a = b;
      b = temp + b;
      length -= 1;
    }

    return sequence;
  }
}

export default FollowLeaderTreeStrategy;
*/
