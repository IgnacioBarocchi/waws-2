import { XYPosition } from "reactflow";
import AnimalGroup from "../../compositions/AnimalGroup";
import Animal from "../../entities/unit/Animal";

export default class FollowLeaderTreeStrategy {
  private group: AnimalGroup;
  private verticalSpacing: number;
  private horizontalSpacing: number;

  constructor(
    group: AnimalGroup,
    verticalSpacing: number,
    horizontalSpacing: number
  ) {
    this.group = group;
    this.verticalSpacing = verticalSpacing;
    this.horizontalSpacing = horizontalSpacing;
  }

  getPositionsForMembers(): [Animal, XYPosition][] {
    const leader = this.group.accessLeader;
    const sortedMembers = this.group.accessSortedMembers;

    if (!leader || sortedMembers.length === 0) return [];

    const fibonacciSequence = this.generateFibonacciSequence(
      sortedMembers.length
    );

    let currentIndex = 0;
    const columns: [Animal, XYPosition][][] = [];

    for (const num of fibonacciSequence) {
      const followerIndices = Array.from(
        { length: num },
        (_, index) => currentIndex + index + 1
      );

      if (followerIndices.length === 0) break;

      const followers = followerIndices
        .map((index) => sortedMembers[index])
        .filter(Boolean);

      const column = this.buildColumn(followers, leader);
      columns.push(column);

      currentIndex += num;
    }

    const positions = this.mergeColumns(columns);
    return positions;
  }

  // private buildColumn(
  //   followers: Animal[],
  //   leader: Animal
  // ): [Animal, XYPosition][] {
  //   const column: [Animal, XYPosition][] = [];
  //   const rootPosition = leader.position;
  //   const startY = rootPosition.y + this.verticalSpacing;

  //   for (let i = 0; i < followers.length; i++) {
  //     const follower = followers[i];
  //     const targetX =
  //       rootPosition.x +
  //       (i - Math.floor(followers.length / 2)) * this.horizontalSpacing;
  //     const targetY = startY + i * this.verticalSpacing;

  //     column.push([follower, { x: targetX, y: targetY }]);
  //   }

  //   return column;
  // }
  private buildColumn(
    followers: Animal[],
    leader: Animal
  ): [Animal, XYPosition][] {
    const column: [Animal, XYPosition][] = [];
    const rootPosition = leader.position;
    const startY = rootPosition.y + this.verticalSpacing;
    const usedPositions: XYPosition[] = [];

    for (let i = 0; i < followers.length; i++) {
      const follower = followers[i];
      let targetX =
        rootPosition.x +
        (i - Math.floor(followers.length / 2)) * this.horizontalSpacing;
      let targetY = startY + i * this.verticalSpacing;
      let position: XYPosition = { x: targetX, y: targetY };

      // Ensure unique position
      while (this.isPositionUsed(position, usedPositions)) {
        targetX += this.horizontalSpacing;
        position = { x: targetX, y: targetY };
      }

      column.push([follower, position]);
      usedPositions.push(position);
    }

    return column;
  }

  private isPositionUsed(
    position: XYPosition,
    usedPositions: XYPosition[]
  ): boolean {
    return usedPositions.some((usedPosition) => {
      return usedPosition.x === position.x && usedPosition.y === position.y;
    });
  }

  private mergeColumns(
    columns: [Animal, XYPosition][][]
  ): [Animal, XYPosition][] {
    const positions: [Animal, XYPosition][] = [];

    for (const column of columns) {
      positions.push(...column);
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
