import { XYPosition } from "reactflow";
import AnimalGroup from "../../compositions/AnimalGroup";
import Animal from "../../entities/unit/Animal";

export default class FollowLeaderRingStrategy {
  private group: AnimalGroup;
  private distanceFromLeader: number;

  constructor(group: AnimalGroup, distanceFromLeader: number) {
    this.group = group;
    this.distanceFromLeader = distanceFromLeader;
  }

  getPositionsForMembers(): [Animal, XYPosition][] {
    const leader = this.group.accessLeader;
    const sortedMembers = this.group.accessSortedMembers;

    if (!leader || sortedMembers.length === 0) return [];

    const angleIncrement = (2 * Math.PI) / sortedMembers.length;
    const leaderPosition = leader.position;

    const positions: [Animal, XYPosition][] = [];

    for (let i = 0; i < sortedMembers.length; i++) {
      const follower = sortedMembers[i];
      const angle = i * angleIncrement;
      const offsetX = Math.cos(angle) * this.distanceFromLeader;
      const offsetY = Math.sin(angle) * this.distanceFromLeader;
      const targetPosition = {
        x: leaderPosition.x + offsetX,
        y: leaderPosition.y + offsetY,
      };

      if (follower instanceof Animal) {
        positions.push([follower, targetPosition]);
      }
    }

    return positions;
  }
}
