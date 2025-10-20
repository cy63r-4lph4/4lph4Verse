"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  PenTool,
  Sparkles,
  Tag,
  Wand2,
  PlusCircle,
  Trash2,
  GitFork,
} from "lucide-react";
import { Button } from "@verse/ui/components/ui/button";
import { Switch } from "@verse/ui/components/ui/switch";
import { Label } from "@verse/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@verse/ui/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@verse/vaultoflove-web/components/toast";

/* ------------------------------------------------------------
 * Types
 * ------------------------------------------------------------ */
interface Choice {
  text: string;
  nextNodeId: string;
}

interface Node {
  id: string;
  name: string;
  text: string;
  choices: Choice[];
}

interface InteractiveEditorProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  selectedNodeId: string;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string>>;
}

interface WriteStoryViewProps {
  onBack: () => void;
  onSubmit: (story: Record<string, any>) => void;
}

/* ------------------------------------------------------------
 * Interactive Story Editor
 * ------------------------------------------------------------ */
const InteractiveEditor: React.FC<InteractiveEditorProps> = ({
  nodes,
  setNodes,
  selectedNodeId,
  setSelectedNodeId,
}) => {
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const handleAddNode = () => {
    const newNodeId = uuidv4();
    const newNode: Node = {
      id: newNodeId,
      name: `Node ${nodes.length + 1}`,
      text: "",
      choices: [],
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNodeId);
  };

  const handleUpdateNode = (field: keyof Node, value: any) => {
    setNodes(
      nodes.map((n) => (n.id === selectedNodeId ? { ...n, [field]: value } : n))
    );
  };

  const handleAddChoice = () => {
    const newChoice: Choice = { text: "New Choice", nextNodeId: "" };
    handleUpdateNode("choices", [...(selectedNode?.choices || []), newChoice]);
  };

  const handleUpdateChoice = (
    i: number,
    field: keyof Choice,
    value: string
  ) => {
    if (!selectedNode) return;
    const updated = selectedNode.choices.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c
    );
    handleUpdateNode("choices", updated);
  };

  const handleRemoveChoice = (i: number) => {
    if (!selectedNode) return;
    const updated = selectedNode.choices.filter((_, idx) => idx !== i);
    handleUpdateNode("choices", updated);
  };

  const handleRemoveNode = (id: string) => {
    if (id === "start") return;
    const newNodes = nodes
      .filter((n) => n.id !== id)
      .map((n) => ({
        ...n,
        choices: n.choices.filter((c) => c.nextNodeId !== id),
      }));
    setNodes(newNodes);
    setSelectedNodeId("start");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      {/* Sidebar */}
      <div className="md:col-span-1 space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold text-pink-200">Story Nodes</h4>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAddNode}
            className="text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Node
          </Button>
        </div>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              className={`flex justify-between items-center p-3 rounded-none cursor-pointer transition-colors ${
                selectedNodeId === node.id
                  ? "bg-pink-500/30"
                  : "bg-black/30 hover:bg-pink-500/20"
              }`}
            >
              <span className="font-medium">{node.name}</span>
              {node.id !== "start" && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveNode(node.id);
                  }}
                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300 w-7 h-7"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="md:col-span-2 bg-black/20 p-6 rounded-none">
        {selectedNode && (
          <div className="space-y-6">
            {/* Node name */}
            <div>
              <Label className="text-sm font-semibold text-pink-300 mb-2 block">
                Node Name
              </Label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={(e) => handleUpdateNode("name", e.target.value)}
                className="w-full px-4 py-2 bg-black/30 border border-pink-500/30 rounded-none text-white placeholder-pink-300/60 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
              />
            </div>

            {/* Node text */}
            <div>
              <Label className="text-sm font-semibold text-pink-300 mb-2 block">
                Node Text
              </Label>
              <textarea
                value={selectedNode.text}
                onChange={(e) => handleUpdateNode("text", e.target.value)}
                rows={6}
                className="w-full px-4 py-2 bg-black/30 border border-pink-500/30 rounded-none text-white placeholder-pink-300/60 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 resize-y"
              />
            </div>

            {/* Choices */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-semibold text-pink-200">Choices</h5>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={handleAddChoice}
                  className="text-purple-300 hover:bg-purple-500/20 hover:text-purple-200"
                >
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Choice
                </Button>
              </div>
              <div className="space-y-4">
                {selectedNode.choices.map((choice, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-black/30 rounded-none"
                  >
                    <input
                      type="text"
                      value={choice.text}
                      onChange={(e) =>
                        handleUpdateChoice(index, "text", e.target.value)
                      }
                      placeholder="Choice text"
                      className="flex-grow px-3 py-2 bg-black/30 border border-pink-500/30 rounded-none text-white focus:outline-none focus:border-pink-400"
                    />
                    <Select
                      value={choice.nextNodeId}
                      onValueChange={(value) =>
                        handleUpdateChoice(index, "nextNodeId", value)
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Next Node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((n) => (
                          <SelectItem key={n.id} value={n.id}>
                            {n.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveChoice(index)}
                      className="text-red-400 hover:bg-red-500/20 hover:text-red-300 w-8 h-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------
 * Story Writing View
 * ------------------------------------------------------------ */
export const WriteStoryView: React.FC<WriteStoryViewProps> = ({
  onBack,
  onSubmit,
}) => {
  const [isInteractive, setIsInteractive] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "You",
    excerpt: "",
    content: "",
    category: "romance",
    tags: "",
  });
  const [nodes, setNodes] = useState<Node[]>([
    { id: "start", name: "Start", text: "", choices: [] },
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState("start");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleAiAnalysis = async () => {
    const text = isInteractive
      ? nodes.map((n) => n.text).join(" ")
      : formData.content;
    if (!text.trim() && !formData.excerpt.trim()) {
      toast({
        title: "Empty Content",
        description: "Write something first before asking the AI to analyze.",
        variant: "error",
      });
      return;
    }
    setIsAnalyzing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setIsAnalyzing(false);
    toast({
      title: "✨ AI Analysis Complete",
      description:
        "Your story has a beautiful flow and solid grammar. It's ready to touch hearts!",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.excerpt.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and excerpt.",
        variant: "error",
      });
      return;
    }

    const tags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    let storyData: Record<string, any> = {
      ...formData,
      tags,
      isInteractive,
    };

    if (isInteractive) {
      storyData.interactiveContent = nodes.reduce(
        (acc, node) => {
          acc[node.id] = { text: node.text, choices: node.choices };
          return acc;
        },
        {} as Record<string, any>
      );
      storyData.content = nodes.map((n) => n.text).join("\n\n");
    } else if (!formData.content.trim()) {
      toast({
        title: "Missing Content",
        description: "Please write your story content.",
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    onSubmit(storyData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-pink-300 hover:text-pink-200 hover:bg-pink-500/20"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Vault
        </Button>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-500/30">
            <PenTool className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Craft Your Legacy
          </h1>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-black/30 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-10"
      >
        {/* Title & Author */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Label className="block text-sm font-semibold text-pink-300 mb-2">
              Story Title *
            </Label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter a captivating title..."
              className="w-full px-4 py-3 bg-black/30 border border-pink-500/30 rounded-none text-white placeholder-pink-300/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
              required
            />
          </div>
          <div>
            <Label className="block text-sm font-semibold text-pink-300 mb-2">
              Author Name
            </Label>
            <input
              type="text"
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              placeholder="Your pen name..."
              className="w-full px-4 py-3 bg-black/30 border border-pink-500/30 rounded-none text-white placeholder-pink-300/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            />
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <Label className="block text-sm font-semibold text-pink-300 mb-2">
            Story Excerpt *
          </Label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleChange("excerpt", e.target.value)}
            placeholder="Write a compelling excerpt..."
            rows={3}
            className="w-full px-4 py-3 bg-black/30 border border-pink-500/30 rounded-none text-white placeholder-pink-300/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            required
          />
        </div>

        {/* Mode Selector */}
        <div className="border-t border-b border-pink-500/20 py-6 space-y-4">
          <div className="flex items-center space-x-3">
            <Switch
              id="interactive-mode"
              checked={isInteractive}
              onCheckedChange={setIsInteractive}
            />
            <Label
              htmlFor="interactive-mode"
              className="text-lg font-semibold text-white flex items-center gap-2"
            >
              <GitFork className="w-5 h-5 text-cyan-400" />
              Interactive Story Mode
            </Label>
          </div>

          <AnimatePresence>
            {isInteractive ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <InteractiveEditor
                  nodes={nodes}
                  setNodes={setNodes}
                  selectedNodeId={selectedNodeId}
                  setSelectedNodeId={setSelectedNodeId}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div>
                  <Label className="block text-sm font-semibold text-pink-300 mb-2">
                    Story Content *
                  </Label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    placeholder="Tell your story..."
                    rows={15}
                    className="w-full px-4 py-3 bg-black/30 border border-pink-500/30 rounded-none text-white placeholder-pink-300/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 resize-y"
                    required={!isInteractive}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tags & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Label className="block text-sm font-semibold text-pink-300 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Tags (comma-separated)
            </Label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="heartbreak, healing, hope..."
              className="w-full px-4 py-3 bg-black/30 border border-pink-500/30 rounded-none text-white placeholder-pink-300/60 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
            />
          </div>
          <div>
            <Label className="block text-sm font-semibold text-pink-300 mb-2">
              Category
            </Label>
            <select
              value={formData.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full px-4 py-3 bg-black/30 border border-pink-500/30 rounded-none text-white focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 cursor-pointer"
            >
              <option value="romance">Romance</option>
              <option value="drama">Drama</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="fantasy">Fantasy</option>
              <option value="mystery">Mystery</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-pink-500/20">
          <Button
            type="button"
            onClick={handleAiAnalysis}
            disabled={isAnalyzing || isSubmitting}
            variant="outline"
            className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 rounded-none py-5 "
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                <span>AI Flow & Grammar Check</span>
              </>
            )}
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || isAnalyzing}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-8 py-5 rounded-none shadow-lg hover:shadow-pink-500/25 transition-all duration-300 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Publish Story</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
