
import { describe, it, expect } from 'vitest';
import { 
  calculateDiscoveryMultiplier, 
  calculateIssueReward, 
  validateIssuePayout 
} from '../../src/lib/karma';

describe('Karma Logic', () => {
  describe('calculateDiscoveryMultiplier', () => {
    it('should return 3.0 for 0 stars', () => {
      expect(calculateDiscoveryMultiplier(0)).toBe(3.0);
    });

    it('should return 2.0 for 1-100 stars', () => {
      expect(calculateDiscoveryMultiplier(1)).toBe(2.0);
      expect(calculateDiscoveryMultiplier(50)).toBe(2.0);
      expect(calculateDiscoveryMultiplier(100)).toBe(2.0);
    });

    it('should return 1.5 for 101-1000 stars', () => {
      expect(calculateDiscoveryMultiplier(101)).toBe(1.5);
      expect(calculateDiscoveryMultiplier(500)).toBe(1.5);
      expect(calculateDiscoveryMultiplier(1000)).toBe(1.5);
    });

    it('should return 1.0 for 1000+ stars', () => {
      expect(calculateDiscoveryMultiplier(1001)).toBe(1.0);
      expect(calculateDiscoveryMultiplier(50000)).toBe(1.0);
    });
  });

  describe('calculateIssueReward', () => {
    it('should calculate base reward correctly based on stars', () => {
      // 0 stars -> 3.0x -> 300
      expect(calculateIssueReward({ stars: 0 })).toBe(300);
      // 50 stars -> 2.0x -> 200
      expect(calculateIssueReward({ stars: 50 })).toBe(200);
      // 500 stars -> 1.5x -> 150
      expect(calculateIssueReward({ stars: 500 })).toBe(150);
      // 2000 stars -> 1.0x -> 100
      expect(calculateIssueReward({ stars: 2000 })).toBe(100);
    });

    it('should add user boosts to the reward', () => {
      // 0 stars (300) + 500 boost = 800
      expect(calculateIssueReward({ stars: 0, totalUserBoost: 500 })).toBe(800);
    });
  });

  describe('validateIssuePayout', () => {
    it('should return valid for normal scenario', () => {
      const result = validateIssuePayout({
        issueAuthorId: 'user1',
        assigneeId: 'user2',
        repoOwnerId: 'user3'
      });
      expect(result.valid).toBe(true);
    });

    it('should fail if Assignee is the Author (Self-Dealing)', () => {
      const result = validateIssuePayout({
        issueAuthorId: 'user1',
        assigneeId: 'user1',
        repoOwnerId: 'user3'

      });
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Self-dealing');
    });

    it('should fail if Assignee is the Repo Owner', () => {
      const result = validateIssuePayout({
        issueAuthorId: 'user1',
        assigneeId: 'user3',
        repoOwnerId: 'user3'
      });
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Repo Owner');
    });

    it('should fail if Reviewer is the Assignee', () => {
      const result = validateIssuePayout({
        issueAuthorId: 'user1',
        assigneeId: 'user2',
        reviewerId: 'user2',
        repoOwnerId: 'user3'
      });
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Reviewer');
    });
  });
});
